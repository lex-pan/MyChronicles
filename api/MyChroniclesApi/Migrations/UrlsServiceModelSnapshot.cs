﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyChroniclesApi.Services;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    [DbContext(typeof(UrlsService))]
    partial class UrlsServiceModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DecipherUrlSteps", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("chronicle_info_category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("domain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("step_number")
                        .HasColumnType("integer");

                    b.Property<string>("word_end")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("word_end_adjustment")
                        .HasColumnType("integer");

                    b.Property<int>("word_end_index")
                        .HasColumnType("integer");

                    b.Property<string>("word_start")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("word_start_adjustment")
                        .HasColumnType("integer");

                    b.Property<int>("word_start_index")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("domain");

                    b.ToTable("decipher_steps");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Urls", b =>
                {
                    b.Property<string>("domain")
                        .HasColumnType("text");

                    b.Property<DateTime>("date_time")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("decipher_method")
                        .HasColumnType("text");

                    b.HasKey("domain");

                    b.ToTable("chronicle_extension_decipher");
                });

            modelBuilder.Entity("DecipherUrlSteps", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Urls", "urls")
                        .WithMany()
                        .HasForeignKey("domain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("urls");
                });
#pragma warning restore 612, 618
        }
    }
}
